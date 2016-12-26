module.exports = {

    //            Views Vars
    // This vars are automaticly render to the ejs templates
    // Via config/http.js interceptor
    // For example in 'views/xx.ejs' file add <%= viewsVars.title %>
    viewsVars: {
        companyName: '',//'Wipeit',
        legalCompanyName: '',//'WipeIt',
        urlWebSite: '',//'https://WipeIt.com.au/',
        APIurl: '/api/',
        urlWebSiteNoHttp: '',//'WipeIt.com.au',
        route: '',
        logo: 'images/logo_78x72.png',
        title: '',//'Wipeit | The Official Wipeit Site',
        description: 'The Official Wipeit website...',
        keywords: '',
        image: 'images/facebook-flyer.jpg',
        googleProfile: 'http://plus.google.com/104040303061795717579',
        twitterProfile: 'http://www.twitter.com/',
        twitterAccount: '@e',
        twitterCard: 'summary_large_image',
        facebookProfile: 'http://www.facebook.com/e',
        og_type: 'website',

        getYear: function() {
            var date = new Date();
            return date.getFullYear();
        }
    },

    //            Views Vars Interceptor
    // Loaded via the config/http.js file
    // First add it to the array order before router like:
    //    order: [ .... , 'loadViewsVarsFromConfigService', 'router']
    // and then add the function like:
    //    order: [ .... , 'loadViewsVarsFromConfigService', 'router'],
    //    loadViewsVarsFromConfigService: (req, res, next)=>{
    //        return ConfigService.viewsVarsInterceptor(req, res, next);
    //    }
    viewsVarsInterceptor: function(req, res, next) {
        // if not is an asset file
        if (ConfigService)
            res.locals.viewsVars = ConfigService.viewsVars;

        return next();
    },

    origin: 'https://wipeit.com.au, ' +
    'https://api.sandbox.paypal.com, ' + 'https://api-3t.sandbox.paypal.com, ' + 'https://api-aa.sandbox.paypal.com, ' + 'https://api-aa-3t.sandbox.paypal.com, ' + 'https://svcs.sandbox.paypal.com, ' + 'https://pointofsale.sandbox.paypal.com, ' + 'https://ipnpb.sandbox.paypal.com, ' + 'https://www.sandbox.paypal.com',

    sessionSecret: function() {
        return 'aa32b333kjha-gsv7x7483ygqh998r4h9tgho845id8ckavip-9t9c96f6sg4e056';
    },
    TOKEN_SECRET: function() {
        return process.env.TOKEN_SECRET || 'localTestingToken-124321125';
    }
}
