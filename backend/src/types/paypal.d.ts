declare module '@paypal/checkout-server-sdk' {
    // Esto permite usar la librería sin que TypeScript se queje
    // Básicamente le decimos que todo lo que venga de aquí es "any"
    const content: any;
    export = content;
}