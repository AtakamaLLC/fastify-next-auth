import { RedirectableProviderType, BuiltInProviderType } from '@auth/core/providers';

/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
declare type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
interface SignInOptions extends Record<string, unknown> {
    /**
       * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
       *
       * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
       */
    callbackUrl?: string;
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
    redirect?: boolean;
}
/** Match `inputType` of `new URLSearchParams(inputType)` */
declare type SignInAuthorizationParams = string | string[][] | Record<string, string> | URLSearchParams;
interface SignOutParams<R extends boolean = true> {
    /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
    callbackUrl?: string;
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
    redirect?: R;
}

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
declare function signIn<P extends RedirectableProviderType | undefined = undefined>(providerId?: LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>, options?: SignInOptions, authorizationParams?: SignInAuthorizationParams): Promise<Response | undefined>;
/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
declare function signOut(options?: SignOutParams): Promise<void>;

export { signIn, signOut };
