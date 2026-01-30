// NOTE: We intentionally *do not* register this as a Fastify plugin to avoid
// encapsulation issues. Call `decorateAuth(app)` on the root instance.
export function decorateAuth(app) {
    app.decorate('authenticate', async (req, _reply) => {
        const decoded = await req.jwtVerify();
        req.authUser = decoded;
    });
}
//# sourceMappingURL=auth.js.map