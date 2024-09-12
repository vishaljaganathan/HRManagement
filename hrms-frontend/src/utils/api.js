const ROOTURL = 'http://127.0.0.1:4000/api/v1/';
const temp = 'http://localhost:4000/employe'
const API = {
    addFaq: ROOTURL + 'faqs/addFaq',
    listFaq: ROOTURL + 'faqs/listFaq',
    viewFaq: ROOTURL + 'faqs/viewFaq',
    updateFaq: ROOTURL + 'faqs/updateFaq',
    softDeleteFaq: ROOTURL + 'faqs/softDeleteFaq',

    addDepartment: ROOTURL + 'departments/addDepartment',
    listDepartment: ROOTURL + 'departments/listDepartment',
    viewDepartment: ROOTURL + 'departments/viewDepartment',
    updateDepartment: ROOTURL + 'departments/updateDepartment',
    softDeleteDepartment: ROOTURL + 'departments/softDeleteDepartment',


    addPolicy: ROOTURL + 'policies/addPolicy',
    listPolicy: ROOTURL + 'policies/listPolicies',
    viewPolicy: ROOTURL + 'policies/viewPolicy',
    updatePolicy: ROOTURL + 'policies/updatePolicy',
    softDeletePolicy: ROOTURL + 'policies/softDeletePolicy',


    addEmployee: ROOTURL + 'emploies/addEmployee',
    listEmployee: ROOTURL + 'emploies/listEmployee',
    viewEmployee: ROOTURL + 'emploies/viewEmployee',
    updateEmployee: ROOTURL + 'emploies/updateEmployee',
    softDeleteEmployee: ROOTURL + 'emploies/softDeleteEmployee',
    
    // Document API
    addDocument: ROOTURL + 'documents/addDocument',
    listDocument: ROOTURL + 'documents/listDocument',
    viewDocument: ROOTURL + 'documents/viewDocument',
    updateDocument: ROOTURL + 'documents/updateDocument',
    softDeleteDocument: ROOTURL + 'documents/softDeleteDocument',
}

const ImportedUrl = {
    API: API
}
export default ImportedUrl;


