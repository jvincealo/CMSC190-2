var Curriculum = require('mongoose').model('Curriculum')

exports.createOrUpdate = function(req, res, next) {
    var code = req.body.code;
    Curriculum.update(
        {code: code},
        req.body,
        {
            upsert: true,
            setDefaults: true
        },
        function(err) {
            var message = "";
            if(err)
                message = err;
            else
                message = "Done!";

            res.json({message: message});
        }
    );
};