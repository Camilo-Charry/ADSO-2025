using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;
using AutoMapper;

namespace Entity.DTOs
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Ejemplo de mapeo
            CreateMap<Form, FormDto>();
            CreateMap<FormDto, Form>();

            CreateMap<Module, ModuleDto>();
            CreateMap<ModuleDto, Module>();

            CreateMap<FormModule, FormModuleDto>();
            CreateMap<FormModuleDto, FormModule>();

            CreateMap<Module, ModuleDto>();
            CreateMap<ModuleDto, Module>();

            CreateMap<Permission, PermissionDto>();
            CreateMap<PermissionDto, Permission>();

            CreateMap<Person, PersonDto>();
            CreateMap<PersonDto, Person>();


            CreateMap<rol, rolDto>();
            CreateMap<rolDto, rol>();

            CreateMap<RolFormPermission, RolFormPermissionDto>()
                .ForMember(dest => dest.FormName, opt => opt.MapFrom(src => src.Form.name))
                .ForMember(dest => dest.RolName, opt => opt.MapFrom(src => src.Rol.name))
                .ForMember(dest => dest.PermissionName, opt => opt.MapFrom(src => src.Permission.name));
            CreateMap<RolFormPermissionDto, RolFormPermission>();

            //CreateMap<RolUser, RolUserDto>();

            CreateMap<RolUser, RolUserDto>()
                        .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.username))
                        .ForMember(dest => dest.RolName, opt => opt.MapFrom(src => src.Rol.name));

            CreateMap<RolUserDto, RolUser>();

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
