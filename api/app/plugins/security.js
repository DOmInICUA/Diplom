const roles = require(process.env.APP + "/stats/roles");

module.exports = (models) => ({
    checkAuth(req) {
        return !!req.currentUser;
    },
    checkRole(req, role) {
        if(this.checkAuth(req)) {
            if(!role) {
                return true;
            }
            const userRole = req.currentUser.role;
            return roles[userRole].index >= roles[role].index;
        }
        return false;
    },
    checkTokenTime(req) {
        //TODO: Limit token time
    }
});