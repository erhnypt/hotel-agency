package com.hotelagency.security;

import com.hotelagency.entity.RoleName;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.security.test.context.support.WithSecurityContext;

/**
 * Populates the test SecurityContext with a real {@link CustomUserDetails} so that
 * {@code @AuthenticationPrincipal CustomUserDetails} resolves correctly in @WebMvcTest slices
 * (unlike {@code @WithMockUser}, which uses a generic Spring Security {@code UserDetails}).
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@WithSecurityContext(factory = WithMockCustomUserSecurityContextFactory.class)
public @interface WithMockCustomUser {
    long userId() default 10L;

    RoleName role();
}
