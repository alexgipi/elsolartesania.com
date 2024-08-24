<script lang="ts">
  import { API_URL } from "../services/ecommerce";

    let formData = {
        email: '',
        password: '',
        passwordRepeat: ''
    };

    interface AlertMessage {
        status: string | null
        message: string | null
        errorType: 'email-exists' | 'password-error' | null,
    }

    let alertMessage:AlertMessage = {
        errorType: null,
        status: null,
        message: null,
    };

    function handleSubmit(e:any){
        e.preventDefault();
        console.log(formData)
        const {email, password, passwordRepeat} = formData;

        if(password != passwordRepeat) {
            alertMessage.errorType = 'password-error';
            alertMessage.status = 'error';
            alertMessage.message = 'Error: Las contraseñas no coinciden';
        } else {
            alertMessage.errorType = null;
            alertMessage.message = null;
            alertMessage.status = null;
            createUser(email, password);
        }
    }

    async function createUser(email:string, password:string){
        const res = await fetch(
            `${API_URL}/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const user = (await res.json()) as any;
        
        if(user.error){
            alertMessage.errorType = 'email-exists';
            alertMessage.status = 'error';
            alertMessage.message = 'Error: Este correo electrónico ya existe';
        } else {
            alertMessage.status = 'success';
            alertMessage.message = 'Usuario creado correctamente';
            window.location.href = '/';
        }
        
    }

</script>

<form on:submit={handleSubmit} class="form register-form">
    {#if alertMessage.message}
        <p class="form-alert {alertMessage.status}">
            {alertMessage.message}
        </p>
    {/if}

    <div class="form-element">
        <label class:invalid={alertMessage.errorType === 'email-exists'}>
            <span>Correo electrónico</span>
            <input 
            bind:value={formData.email} 
            required 
            type="email" 
            name="email" 
            placeholder="Introduce tu correo electrónico">
        </label>
    </div>
    <div class="form-element">
        <label class:invalid={alertMessage.errorType === 'password-error'}>
            <span>Contraseña</span>
            <input 
            bind:value={formData.password} 
            required 
            type="password" 
            name="password" 
            placeholder="Escribe tu nueva contraseña"
            >
        </label>        
    </div>

    <div class="form-element">
        <label class:invalid={alertMessage.errorType === 'password-error'}>
            <span>Repetir contraseña</span>
            <input 
            bind:value={formData.passwordRepeat} 
            required 
            type="password" 
            name="password-repeat" 
            placeholder="Vuelve a escribir tu nueva contraseña"
            >
        </label>
    </div>

    <footer>
        <button type="submit">
            Crear cuenta
        </button>
        <div class="flex flex-col gap-2 mt-4">
            <p class="mt-2 text[#626262]">¿Ya tienes tu cuenta?</p>
            <a href="/login"> Inicia sesión con tu cuenta de El Sol Artesanía</a>
        </div>
    </footer>
</form>