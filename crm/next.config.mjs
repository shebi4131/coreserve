const dev=process.env.NODE_ENV==='development';
export default { ...(dev?{}:{output:'export'}), distDir: dev?'.next-dev':'.next', trailingSlash:true, poweredByHeader:false, experimental:{cpus:1}, ...(dev?{async rewrites(){return [{source:'/api/:path*',destination:'http://127.0.0.1:3003/api/:path*'}];}}:{}) };
