import { objAlert2 } from "./sweetAlert";

function Notes({Title,Text,vrDate_D,vrDate_H,vrID,funcMessage,vrDelete}){

    const funcDelete = (e)=>{
        objAlert2.fire({
            icon: "question",
            title: <span className="text-primary">Are you sure you want to delete this note?</span>,
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: "Delete"
        }).then((res)=>{
            if(res.isDenied){
                vrDelete(vrID);
            }
        })
 
    }

    return(
        <div className="card m-2">
            <div className="card-header">
            <h4 className="card-title text-truncate">{Title}</h4>
            </div>
            <div className="card-body">
            <p className="card-text text-truncate">{Text}</p>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between p-4">
            <div>
                <span>{vrDate_D}</span>
                <span>{vrDate_H}</span>
            </div>
            <div>
                <button className="card-btnDelate" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={(e)=>{
                    return funcMessage(vrID,"modifyNote")
                }}>
                    <i className="bi bi-pen"></i>
                </button>
                <button className="card-btnDelate" onClick={funcDelete}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
            </div>
        </div>
    )
}

export {Notes};