exports.routeList = (app) => {


    let routes = [];

    function print(path, layer) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
        } else if (layer.method) {
            routes.push({
                method: layer.method.toUpperCase(),
                path: path.concat(split(layer.regexp)).filter(Boolean).join('/')
            })
        }
    }

    function split(thing) {
        if (typeof thing === 'string') {
            return thing.split('/')
        } else if (thing.fast_slash) {
            return ''
        } else {
            var match = thing.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
            return match ?
                match[1].replace(/\\(.)/g, '$1').split('/') :
                '<complex:' + thing.toString() + '>'
        }
    }

    app._router.stack.forEach(print.bind(null, []))

    /* 
     RoutesList.terminal = function (app) {
        RoutesList.table = new AsciiTable("List All Routes");
        RoutesList.table.setHeading("Method", "URI");
        app._router.stack.forEach(RoutesList.print.bind(undefined, []));
        RoutesList.data.forEach(function (item) {
            RoutesList.table.addRow(item.method, item.URI);
        });
        console.log(RoutesList.table.toString());
    };
    */

   var AsciiTable = require("ascii-table");
    let table = new AsciiTable("List All Routes");
    table.setHeading("Sr.No.","Method", "URI");
    
    let tablePaths=[];
    let srNo=1;
    for(let i=0; i<routes.length; i++){
        let method = routes[i].method;
        let path = routes[i].path;
        if(tablePaths.includes(path)){
            continue;
        }

        table.addRow(srNo, method, path);
        // console.log(srNo+","+method+","+path)
        tablePaths.push(path)
        srNo++;
    }
    console.log(table.toString());
}