export default { output: 'export', distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', trailingSlash: true, poweredByHeader: false, experimental: { cpus: 1 } };
