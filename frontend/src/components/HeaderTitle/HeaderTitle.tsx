import './HeaderTitle.css'

function HeaderTitle() {

    switch (window.location.pathname) {
        case '/register':
            return <h1>Cadastro de Usuários</h1>
        case '/login':
            return <h1>Login</h1>
        default:
            return <h1>Seja bem vindo ao Sec Proj</h1>
    }
}

export default HeaderTitle;