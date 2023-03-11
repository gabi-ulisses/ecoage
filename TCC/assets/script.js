const password = document.getElementById('senha_login');
const icon = document.getElementById('icon');

function mostrarOcultar_login(){
    if (password.type === 'password'){
        password.setAttribute('type','text');
        icon.classList.add('ocultar');
    }else{
        password.setAttribute('type','password');
        icon.classList.remove('ocultar');
    }
}

const password_cadastro = document.getElementById('senha_cadastro');
const icon_cadastro = document.getElementById('icon_cadastro');

function mostrarOcultar_cadastro(){
    if (password_cadastro.type === 'password'){
        password_cadastro.setAttribute('type','text');
        icon_cadastro.classList.add('ocultar');
    }else{
        password_cadastro.setAttribute('type','password');
        icon_cadastro.classList.remove('ocultar');
    }
}

const password_edicao = document.getElementById('senha_cadastro');
const icon_edicao = document.getElemenById('icon_edicao');

function mostrarOcultar_edicao(){
    if (password_edicao.type === 'password'){
        password_edicao.setAttribute('type','text');
        icon_edicao.classList.add('ocultar');
    }else{
      password_edicao.setAttribute('type','password');
        icon_edicao.classList.remove('ocultar');
    }
}

window.addEventListener("load", setEventos);

function setEventos() {
  let button = document.getElementById('btnlogin');
  button.addEventListener("click", validarLogin);

  document.getElementById("apelido_login").addEventListener("focus", limparCampo);
  document.getElementById("senha_login").addEventListener("focus", limparCampo);
}

function validarLogin() {

  let apelido = document.getElementById("apelido_login").value;
  let senha = document.getElementById("senha_login").value;
  let dados_form = new FormData();
  dados_form.append("apelido", apelido);
  dados_form.append("senha", senha);

  fetch("../src/login.php", {
    method: 'POST',
    body: dados_form,
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error(response.text());
    }
    return response.json();
  })
  .then(function(objeto) {
    if (objeto.autenticado){
      window.location.href = "../src/pagina_inicial.php";
    } else {
      document.getElementById("id_msg").innerHTML = objeto.msg;
    }
  })
  .catch(function(erro) { 
    document.getElementById("id_msg").innerHTML = "Erro na requisição";
    console.error(erro);
  });
}

function limparCampo() {
  document.getElementById("id_msg").innerHTML = "";
}


function confirmarvisaousu(){
    alert("Você verá a página como usuário.");
    window.location="../src/tecidos.php";
}

function confirmarvisaousu_noticia(){
    alert("Você verá a página como usuário.");
    window.location="../src/site_externo.php";
}


function inserirnoticia(){
    alert("Esta aplicação web é um protótipo. Essa função ainda não foi implementada.");
    window.location="../src/site_externo_adm.php";
}

function confirmar_edicao_tecido(form){

swal.fire({
  title: "Deseja realmente alterar o tecido?",
  text: "Cuidado! Em caso de arrependimento, seus dados deverão novamente ser editados.",
  icon: "warning",
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#8A2BE2',
  showCancelButton: true,
  cancelButtonText: 'Cancelar',
  confirmButtonText: 'Sim, editar',
  allowOutsideClick: true,
  closeOnConfirm: false,
  closeOnCancel: false
})
.then((result) => {
  if (result.value) {
     form.submit();
  }else if (result.dismiss === Swal.DismissReason.cancel){
    swal.fire(
      'Edição cancelada.',
      'O Tecido não foi editado',
      'info'
    )
  }
});
return false;
}

function botao_Editar(event){
// Adiciona um event listener no botão de submit

  event.preventDefault();

  Swal.fire({
    title: "Deseja realmente alterar seus dados?",
    text: "Cuidado! Em caso de arrependimento, seus dados deverão novamente ser editados.",
    icon: "warning",
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#8A2BE2',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, editar',
    allowOutsideClick: true,
    closeOnConfirm: false,
    closeOnCancel: false
  }).then((result) => {
      if (result.value) {
          $('#modalconfirmarSenha').modal('show');
          return false;
        } else if (result.dismiss === Swal.DismissReason.cancel){
          Swal.fire(
            'Edição cancelada.',
            'Seus dados permanecem inalterados',
            'info'
          )
        }
      });

}

  function duvida_token(){
    Swal.fire({
      icon: 'question',
      title: 'Por que recebi esse erro?',
      html: 'Há uma série de motivos pelo qual este erro pode ter acontecido. <br><br> 1. Caso esteja pedindo o token pela segunda vez, certifique-se de que o último já expirou.<br>2. Certifique-se de que o token está digitado corretamente. <br> 3. Certifique-se de que o token que está usando ainda não expirou (não passaram mais de 5 minutos).',
      showCancelButton: false,
      confirmButtonText: 'Entendi!'
      
  })
}

  function verificarSenha() {
    
      var senha1 = document.getElementById("senha1").value;
      var senha2 = document.getElementById("senha2").value;
      var resultado = document.getElementById("resultado");
      if (senha1 == senha2) {
        resultado.style.color = "green";
        resultado.innerHTML = "As senhas coincidem!";
        document.getElementById("submit").disabled = false;
      } else {
        resultado.style.color = "red";
        resultado.innerHTML = "As senhas não coincidem.";
        document.getElementById("submit").disabled = true;
      }
    }
