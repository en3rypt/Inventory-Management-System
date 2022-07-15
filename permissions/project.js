const canView = (user, project) => {
    if (user.AuthType === 1) {
        return true;
    } else if (user.AuthType === 2) {
        return project.userId === user.id;
    } else if (user.AuthType === 3) {
        return project.userId === user.id;
    }
}
const canEdit = (user, project) => {
    if (user.AuthType === 1) {
        return true;
    } else if (user.AuthType === 2) {
        return project.userId === user.id;
    } else if (user.AuthType === 3) {
        return project.userId === user.id;
    }
}
const canDelete = (user, project) => {
    if (user.AuthType === 1) {
        return true;
    } else if (user.AuthType === 2) {
        return project.userId === user.id;
    } else if (user.AuthType === 3) {
        return project.userId === user.id;
    }
}
const canCreate = (user, project) => {
    if (user.AuthType === 1) {
        return true;
    } else if (user.AuthType === 2) {
        return project.userId === user.id;
    } else if (user.AuthType === 3) {
        return project.userId === user.id;
    }
}   