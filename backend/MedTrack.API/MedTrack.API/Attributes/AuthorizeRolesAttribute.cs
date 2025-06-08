using System;
using System.Linq;
using MedTrack.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace MedTrack.API.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class AuthorizeRolesAttribute : AuthorizeAttribute
    {
        public AuthorizeRolesAttribute(params UserRole[] roles)
        {
            if (roles == null || roles.Length == 0)
                throw new ArgumentException("At least one role must be specified.", nameof(roles));

            // Convert enum values to comma-separated string
            Roles = string.Join(",", roles.Select(r => r.ToString()));
        }
    }
}
