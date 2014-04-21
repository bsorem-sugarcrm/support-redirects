var fs = require('fs'),
    aws = require('aws-sdk'),
    bucket = 'support-sugarcrm-com',
    destination = '/02_Documentation/08_Unsupported_Versions',
    file = process.argv[2];

aws.config.loadFromPath('./s3.json');
var s3 = new aws.S3({apiVersion: '2006-03-01'});

try {
    var f = fs.readFileSync(__dirname + '/' + process.argv[2]) + '';
    var lines = f.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        var url = lines[i];
        if (url.indexOf('/') === 0) url = url.substring(1, url.length);
        var params = {
            Bucket: bucket,
            ContentType: 'text/html',
            ACL: 'public-read',
            Key: url,
            WebsiteRedirectLocation: destination
        };
    }

    try {
        s3.putObject(params, function(err, data){
            if (err) {
                console.log(err);
                console.log(url);
                console.log(i);
                process.exit(1);
            }

            console.log(data);

            console.log("Saved: " + url);
        });
    }
    catch (s3err) {
        console.log(s3err);
        console.log(url);
        console.log(i);
        process.exit(1);
    }
}
catch (e) {
    console.log("ERROR: Couldn't read file " + file);
}