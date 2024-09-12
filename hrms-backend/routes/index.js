const BaseUrl = '/api/v1/';

module.exports = function(app) {
    app.use(BaseUrl+"faqs", require('../controllers/admin/faq'));
    app.use(BaseUrl+"departments", require('../controllers/admin/department'));
    app.use(BaseUrl+"common", require('../controllers/admin/common'));
    app.use(BaseUrl+"documents", require('../controllers/admin/document'));
    app.use(BaseUrl+"policies", require('../controllers/admin/policy'));
    app.use(BaseUrl+"employies", require('../controllers/admin/employee'));
}
