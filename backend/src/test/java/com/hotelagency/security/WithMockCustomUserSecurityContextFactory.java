package com.hotelagency.security;

import com.hotelagency.entity.Role;
import com.hotelagency.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser annotation) {
        Role role = new Role(annotation.role());
        role.setId(1L);

        User user = new User();
        user.setId(annotation.userId());
        user.setEmail("test-" + annotation.userId() + "@example.com");
        user.setFullName("Test User");
        user.setRole(role);

        CustomUserDetails principal = new CustomUserDetails(user);
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        return context;
    }
}
