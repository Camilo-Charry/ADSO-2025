// Servidor Express para manejar las peticiones a la base de datos
const express = require("express")
const bodyParser = require("body-parser")
const { Pool } = require("pg") // Para PostgreSQL
const mysql = require("mysql2/promise") // Para MySQL
const sql = require("mssql") // Para SQL Server
const cors = require("cors")
const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

// Configuración de la base de datos
const dbConfig = {
  // Configuración para PostgreSQL
  postgres: {
    host: "localhost",
    port: 5432,
    database: "piscicontrol",
    user: "postgres",
    password: "tu_contraseña",
  },
  // Configuración para MySQL
  mysql: {
    host: "localhost",
    port: 3306,
    database: "piscicontrol",
    user: "root",
    password: "tu_contraseña",
  },
  // Configuraci��n para SQL Server
  sqlserver: {
    server: "localhost",
    database: "piscicontrol",
    user: "sa",
    password: "tu_contraseña",
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
}

// Tipo de base de datos a utilizar: 'postgres', 'mysql' o 'sqlserver'
const dbType = "postgres"

// Función para obtener conexión a la base de datos
async function getDbConnection() {
  try {
    if (dbType === "postgres") {
      const pool = new Pool(dbConfig.postgres)
      return pool
    } else if (dbType === "mysql") {
      const connection = await mysql.createConnection(dbConfig.mysql)
      return connection
    } else if (dbType === "sqlserver") {
      await sql.connect(dbConfig.sqlserver)
      return sql
    } else {
      throw new Error("Tipo de base de datos no soportado")
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error)
    throw error
  }
}

// Función para ejecutar consultas según el tipo de base de datos
async function executeQuery(query, params = []) {
  try {
    if (dbType === "postgres") {
      const pool = await getDbConnection()
      const result = await pool.query(query, params)
      return result.rows
    } else if (dbType === "mysql") {
      const connection = await getDbConnection()
      const [rows] = await connection.execute(query, params)
      await connection.end()
      return rows
    } else if (dbType === "sqlserver") {
      const db = await getDbConnection()
      const result = await db.query(query)
      return result.recordset
    }
  } catch (error) {
    console.error("Error al ejecutar consulta:", error)
    throw error
  }
}

// Endpoint para obtener datos de una tabla
app.get("/api/data/:tableName", async (req, res) => {
  const { tableName } = req.params

  try {
    // Validar el nombre de la tabla para evitar inyección SQL
    const validTableNames = [
      "formcontrollerprueba",
      "formmodule",
      "module",
      "permission",
      "person",
      "rol",
      "rolformpermission",
      "roluser",
      "user",
    ]

    if (!validTableNames.includes(tableName)) {
      return res.status(400).json({ error: "Nombre de tabla no válido" })
    }

    const query = `SELECT * FROM ${tableName}`
    const data = await executeQuery(query)

    res.json(data)
  } catch (error) {
    console.error(`Error al obtener datos de ${tableName}:`, error)
    res.status(500).json({ error: "Error al obtener datos" })
  }
})

// Endpoint para obtener la estructura de una tabla
app.get("/api/structure/:tableName", async (req, res) => {
  const { tableName } = req.params

  try {
    // Validar el nombre de la tabla para evitar inyección SQL
    const validTableNames = [
      "formcontrollerprueba",
      "formmodule",
      "module",
      "permission",
      "person",
      "rol",
      "rolformpermission",
      "roluser",
      "user",
    ]

    if (!validTableNames.includes(tableName)) {
      return res.status(400).json({ error: "Nombre de tabla no válido" })
    }

    let query

    if (dbType === "postgres") {
      query = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `
    } else if (dbType === "mysql") {
      query = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = ?
        AND table_schema = '${dbConfig.mysql.database}'
        ORDER BY ordinal_position
      `
    } else if (dbType === "sqlserver") {
      query = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = @tableName
        ORDER BY ordinal_position
      `
    }

    const columns = await executeQuery(query, [tableName])

    // Transformar la información de columnas a estructura de formulario
    const formStructure = columns.map((column) => {
      let type = "text"

      // Mapear tipos de datos SQL a tipos de input HTML
      if (column.data_type.includes("int")) {
        type = "number"
      } else if (column.data_type.includes("date")) {
        type = "date"
      } else if (column.data_type.includes("time")) {
        type = "time"
      } else if (
        column.data_type.includes("text") ||
        (column.data_type.includes("varchar") && column.character_maximum_length > 100)
      ) {
        type = "textarea"
      } else if (column.data_type.includes("bool")) {
        type = "checkbox"
      }

      return {
        name: column.column_name,
        label: column.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        type: type,
        required: column.is_nullable === "NO",
      }
    })

    res.json(formStructure)
  } catch (error) {
    console.error(`Error al obtener estructura de ${tableName}:`, error)
    res.status(500).json({ error: "Error al obtener estructura" })
  }
})

// Endpoint para agregar un registro
app.post("/api/data/:tableName", async (req, res) => {
  const { tableName } = req.params
  const record = req.body

  try {
    // Validar el nombre de la tabla para evitar inyección SQL
    const validTableNames = [
      "formcontrollerprueba",
      "formmodule",
      "module",
      "permission",
      "person",
      "rol",
      "rolformpermission",
      "roluser",
      "user",
    ]

    if (!validTableNames.includes(tableName)) {
      return res.status(400).json({ error: "Nombre de tabla no válido" })
    }

    // Obtener las columnas y valores del registro
    const columns = Object.keys(record)
    const values = Object.values(record)

    let query

    if (dbType === "postgres") {
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
      query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`
    } else if (dbType === "mysql") {
      const placeholders = columns.map(() => "?").join(", ")
      query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`
    } else if (dbType === "sqlserver") {
      const placeholders = columns.map((col) => `@${col}`).join(", ")
      query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders}); SELECT SCOPE_IDENTITY() AS id`
    }

    const result = await executeQuery(query, values)

    res.status(201).json(result[0] || { success: true })
  } catch (error) {
    console.error(`Error al agregar registro en ${tableName}:`, error)
    res.status(500).json({ error: "Error al agregar registro" })
  }
})

// Endpoint para actualizar un registro
app.put("/api/data/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params
  const record = req.body

  try {
    // Validar el nombre de la tabla para evitar inyección SQL
    const validTableNames = [
      "formcontrollerprueba",
      "formmodule",
      "module",
      "permission",
      "person",
      "rol",
      "rolformpermission",
      "roluser",
      "user",
    ]

    if (!validTableNames.includes(tableName)) {
      return res.status(400).json({ error: "Nombre de tabla no válido" })
    }

    // Obtener las columnas y valores del registro
    const columns = Object.keys(record)
    const values = Object.values(record)

    let query

    if (dbType === "postgres") {
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ")
      query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`
      values.push(id)
    } else if (dbType === "mysql") {
      const setClause = columns.map((col) => `${col} = ?`).join(", ")
      query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`
      values.push(id)
    } else if (dbType === "sqlserver") {
      const setClause = columns.map((col) => `${col} = @${col}`).join(", ")
      query = `UPDATE ${tableName} SET ${setClause} WHERE id = @id; SELECT * FROM ${tableName} WHERE id = @id`
      values.push(id)
    }

    const result = await executeQuery(query, values)

    if (result.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" })
    }

    res.json(result[0] || { success: true })
  } catch (error) {
    console.error(`Error al actualizar registro en ${tableName}:`, error)
    res.status(500).json({ error: "Error al actualizar registro" })
  }
})

// Endpoint para eliminar un registro
app.delete("/api/data/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params

  try {
    // Validar el nombre de la tabla para evitar inyección SQL
    const validTableNames = [
      "formcontrollerprueba",
      "formmodule",
      "module",
      "permission",
      "person",
      "rol",
      "rolformpermission",
      "roluser",
      "user",
    ]

    if (!validTableNames.includes(tableName)) {
      return res.status(400).json({ error: "Nombre de tabla no válido" })
    }

    let query

    if (dbType === "postgres") {
      query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`
    } else if (dbType === "mysql") {
      query = `DELETE FROM ${tableName} WHERE id = ?`
    } else if (dbType === "sqlserver") {
      query = `DELETE FROM ${tableName} WHERE id = @id`
    }

    const result = await executeQuery(query, [id])

    if (result.length === 0 && dbType !== "mysql") {
      return res.status(404).json({ error: "Registro no encontrado" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error(`Error al eliminar registro de ${tableName}:`, error)
    res.status(500).json({ error: "Error al eliminar registro" })
  }
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`)
})
