var baseModel = require(appRoot + '/models/baseModel');
exports.addRbackModule = async(fparam) => {
    try {
        const {uid, module_name, check_string, status} = fparam;
        let selectstr, insertStr, userid;
        userid = await getUserId(uid);
        selectstr = await baseModel.read(`select * from main_modules where (isdeleted is null or isdeleted <> 1) and (name = '${module_name}' or check_string = '${check_string}')`)
        if(selectstr.length == 0)
        {
            insertStr = `insert into main_modules(name, check_string, status, created_date, created_by, updated_date, updated_by) values('${module_name}', '${check_string}', ${status}, sysdate(), ${userid}, sysdate(), ${userid} )`
            insertResult = await baseModel.create(insertStr);
            return {sucessflag: true, msg:`Module ${module_name} added.`}
        }
        else
            return {sucessflag: false, msg:`Module '${module_name}' or check_string '${check_string}' already exists.`}
    } catch (error) {
        console.error('Exception in addRbackModule :'+error)
        return false;
    }
}

const getUserId = async(fparam) => {
    try {
        let sqlstr, uid = fparam
        sqlstr = await baseModel.read(`select id from users where uid = '${uid}'`);
        return sqlstr[0].id;
    } catch (error) {
        console.error('Exception in getUserId : '+error);
    }
}
exports.getUserId = getUserId;

exports.updateRbackModule = async(fparam) => {
    try {
        const {uid, update_fields, moduleid} = fparam;
        let selectstr, updateStr, userid, setcols, updateStrResult, select_module;
        userid = await getUserId(uid);
        selectstr = await baseModel.read(`select name,id from main_modules where id = '${moduleid}'`)
        if(selectstr.length > 0)
        {
            setcols = []
            for(key in update_fields){
                if(key == "name" || key == "check_string" )
                    setcols.push(`${key} = '${update_fields[key]}'`)
            }
            if(setcols.length > 0){
                retmsg = []
                if(setcols.length > 1){
                    select_module = await baseModel.read(`select * from main_modules where (${setcols.join(' OR ')}) and (isdeleted is null or isdeleted <> 1) and id <> ${moduleid}`)
                    retmsg = `Module '${update_fields.name}' or check_string '${update_fields.check_string}' already exists.`
                }
                else {
                    select_module = await baseModel.read(`select * from main_modules where ${setcols[0]}  and (isdeleted is null or isdeleted <> 1) and id <> ${moduleid} `);
                    retmsg =  `${setcols[0]} already exists.`
                }
                if(select_module.length == 0){
                    updateStr = `update main_modules set ${setcols.join(', ')}, updated_date = sysdate(), updated_by = ${userid} where id = ${moduleid}`
                    updateStrResult = await baseModel.update(updateStr);
                }
                else
                    return {sucessflag: false, msg:retmsg}
            }
            return {sucessflag: true, msg:`Module '${selectstr[0].name}' updated.`}
        }
        else
            return {sucessflag: false, msg:`Module with id '${moduleid}' does not exists.`}
    } catch (error) {
        console.error('Exception in updateRbackModule :'+error)
        return false;
    }
}

exports.deleteRbackModule = async(fparam) => {
    try {
        const {uid, status, moduleid, isDelete} = fparam;
        let selectstr, updateStr, userid, updatecondtn = "";
        userid = await getUserId(uid);
        selectstr = await baseModel.read(`select name,id from main_modules where id = '${moduleid}'`)
        if(selectstr.length > 0)
        {
            if(isDelete) 
                updatecondtn = ", isdeleted = 1"
            updateStr = `update main_modules set status = ${status}, updated_date = sysdate(), updated_by = ${userid} ${updatecondtn} where id = ${moduleid}`
            updateStrResult = await baseModel.update(updateStr);
            return {sucessflag: true, msg:`Status updated for Module '${selectstr[0].name}'.`}
        }
        else
            return {sucessflag: false, msg:`Module with id '${moduleid}' does not exists.`}
    } catch (error) {
        console.error('Exception in deleteRbackModule :'+error)
        return false;
    }
}

exports.readRbackModule = async(fparam) => {
    try {
        const {modulename} = fparam;
        let selectstr
        selectstr = await baseModel.read(`select name, id, check_string, case when status = 1 then 'active' else 'inactive' end status from main_modules where name = '${modulename}'`)
        return {sucessflag: true, msg:selectstr}
    } catch (error) {
        console.error('Exception in readRbackModule :'+error)
        return false;
    }
}

exports.readAllRbackModule = async(fparam) => {
    try {
        const {modulename} = fparam;
        let selectstr
        selectstr = await baseModel.read(`select name, id, check_string, case when status = 1 then 'active' else 'inactive' end status from main_modules where isdeleted is null or isdeleted <> 1 order by id desc`);
        return {sucessflag: true, msg:selectstr}
    } catch (error) {
        console.error('Exception in readAllRbackModule :'+error)
        return false;
    }
}