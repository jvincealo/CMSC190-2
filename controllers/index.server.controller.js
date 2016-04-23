exports.render = function(req, res) {
    res.render('index', {
        title: 'In Progress'
    });
};

exports.home = function(req, res) {
    res.render('home');
}

exports.create = function(req, res) {
    res.render('canvas');
}