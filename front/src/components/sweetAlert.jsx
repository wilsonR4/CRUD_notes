import sweetalert2 from "sweetalert2"
import alert2Content from "sweetalert2-react-content"

const objAlert2 = alert2Content(sweetalert2);
const objAlert2Mixin = objAlert2.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer:2000,
    didOpen: (event)=>{
        event.onmouseenter = objAlert2.stopTimer;
        event.onmouseleave = objAlert2.resumeTimer;
    }
});

export {objAlert2,objAlert2Mixin};