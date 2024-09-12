import Swal from 'sweetalert2'

export function Success(params) {
    return Swal.fire({
        position: "top-end",
        icon: "success",
        title: params,
        showConfirmButton: false,
        timer: 1500
    });
}

export function Error(params) {
    return Swal.fire({
        icon: "error",
        text: params,
    });
}