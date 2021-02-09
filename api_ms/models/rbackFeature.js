var baseModel = require(appRoot + '/models/baseModel');
var rbackModule = require('../models/rbackModule');

exports.addRbackFeature = async(fparam) => {
    try {
        const {uid, module_name, features} = fparam;
        let selectstr, insertStr, userid, featureAdded = [], featureExists = [], finalmsg = [];
        userid = await rbackModule.getUserId(uid);
        selectstr = await baseModel.read(`select id, name from main_modules where name = '${module_name}' and (isdeleted is null or isdeleted <> 1)`)
        if(selectstr.length > 0)
        {
            for(let i=0; i<features.length; i++){
                selectstr_feature = await baseModel.read(`select * from main_modules_features where  (isdeleted is null or isdeleted <> 1) and (upper(name) = Upper('${features[i].feature_name}') or Upper(check_string) = Upper('${features[i].check_string}'))`);
                if(selectstr_feature.length == 0){
                    insertStr = `insert into main_modules_features(name, check_string, main_modules_id, status, created_date, created_by, updated_date, updated_by) values('${features[i].feature_name}', '${features[i].check_string}', ${selectstr[0].id}, ${features[i].status}, sysdate(), ${userid}, sysdate(), ${userid} )`
                    insertResult = await baseModel.create(insertStr);
                    featureAdded.push(features[i].feature_name);
                    //return {sucessflag: true, msg:`Feature ${features[i].feature_name} in module ${features[i].module_name} added.`}
                }
                else{
                    featureExists.push(`Feature '${features[i].feature_name}' or check_string '${features[i].check_string}' already exists.`)
                    //return {sucessflag: false, msg:`Feature '${feature_name}' or check_string '${check_string}' already exists.`}   
                }
            }
        }
        else{
                //moduleExists.push(module_name);
                //finalmsg.push(`Module(s) ${module_name} does not exists.`)
                return {sucessflag: false, msg : `Module ${module_name} does not exists.`};
            //return {sucessflag: false, msg:`Module ${module_name} does not exists.`}
        }
/*         if(moduleExists.length>0){
            finalmsg.push(`Module(s) ${moduleExists.join(', ')} does not exists.`)
            return {sucessflag: false, msg : finalmsg.join(' ')};
        } */
        if(featureAdded.length>0){
            finalmsg.push(`Feature(s) ${featureAdded.join(', ')} added.`)
        }
        if(featureExists.length>0){
            finalmsg.push(featureExists.join(' '));
        }
        return {sucessflag: true, msg : finalmsg.join(' ')};
    } catch (error) {
        console.error('Exception in addRbackFeature :'+error)
        return false;
    }
}

exports.updateRbackFeature = async(fparam) => {
    try {
        const {uid, update_fields, moduleid} = fparam;
        let selectstr, updateStr, userid, setcols, updateStrResult;
        userid = await rbackModule.getUserId(uid);
        selectstr = await baseModel.read(`select name,id from main_modules_features where id = '${moduleid}'`)
        if(selectstr.length > 0)
        {
            setcols_where = []
            setcols = [];
            for(key in update_fields){
                if(key == "name" || key == "check_string" ){
                    setcols_where.push(`Upper(${key}) = Upper('${update_fields[key]}')`)
                    setcols.push(`${key} = '${update_fields[key]}'`)
                }
            }
            if(setcols.length > 0){
                retmsg = []
                if(setcols.length > 1){
                    select_module = await baseModel.read(`select * from main_modules_features where (isdeleted is null or isdeleted <> 1) and (${setcols_where.join(' OR ')}) and id <> ${moduleid}`)
                    retmsg = `Feature '${update_fields.name}' or check_string '${update_fields.check_string}' already exists.`
                }
                else {
                    select_module = await baseModel.read(`select * from main_modules_features where (isdeleted is null or isdeleted <> 1) and ${setcols_where[0]}  and id <> ${moduleid} `);
                    retmsg =  `${setcols[0]} already exists.`
                }
                if(select_module.length == 0){
                    updateStr = `update main_modules_features set ${setcols.join(', ')}, updated_date = sysdate(), updated_by = ${userid} where id = ${moduleid}`
                    updateStrResult = await baseModel.update(updateStr);
                }
                else
                    return {sucessflag: false, msg:retmsg}
            }
            return {sucessflag: true, msg:`Feature '${selectstr[0].name}' updated.`}
        }
        else
            return {sucessflag: false, msg:`Feature with id ${moduleid} does not exists.`}
    } catch (error) {
        console.error('Exception in updateRbackFeature :'+error)
        return false;
    }
}

exports.deleteRbackFeature = async(fparam) => {
    try {
        const {uid, status, featurename, isDelete} = fparam;
        let selectstr, updateStr, userid;
        userid = await rbackModule.getUserId(uid);
        selectstr = await baseModel.read(`select name,id from main_modules_features where upper(name) = upper('${featurename}')`)
        let updatecondtn = "";
        if(selectstr.length > 0)
        {
            if(isDelete) 
                updatecondtn = ", isdeleted = 1"
            updateStr = `update main_modules_features set status = ${status}, updated_date = sysdate(), updated_by = ${userid} ${updatecondtn} where upper(name) = upper('${featurename}')`
            updateStrResult = await baseModel.update(updateStr);
            return {sucessflag: true, msg:`Status updated for Feature '${selectstr[0].name}'.`}
        }
        else
            return {sucessflag: false, msg:`Feature '${featurename}' does not exists.`}
    } catch (error) {
        console.error('Exception in deleteRbackFeature :'+error)
        return false;
    }
}

exports.readRbackFeature = async(fparam) => {
    try {
        const {featurename} = fparam;
        let selectstr
        selectstr = await baseModel.read(`select mmf.name feature_name,mmf.id feature_id,mmf.check_string feature_check_string,main_modules_id, mm.name module_name, case when mmf.status = 1 then 'active' else 'inactive' end status from main_modules_features mmf, main_modules mm where mm.name = '${featurename}' and mmf.main_modules_id = mm.id and (mmf.isdeleted is null or mmf.isdeleted <> 1)`)
        return {sucessflag: true, msg:selectstr}
    } catch (error) {
        console.error('Exception in readRbackFeature :'+error)
        return false;
    }
}