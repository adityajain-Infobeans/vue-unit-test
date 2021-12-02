<template>
    <div>
        <div
            v-if="is_login"
            data-testid="welcomeMessage">{{ welcomeMessage }}</div>
        <div v-else>
            <h1>{{ mainHeader }}</h1>
            <h2>{{ formHeader }}</h2>
            <form
                method="post"
                @submit.prevent="submitForm">
                <label for="email">Email: </label><input
                    id="email"
                    v-model.lazy="emailData"
                    type="text"
                    name="email"
                    placeholder="Please enter your email"
                    data-testid="loginEmail"/>
                <br />
                <label for="password">Password: </label><input
                    id="password"
                    v-model.lazy="passwordData"
                    type="password"
                    name="password"
                    placeholder="Please enter your password"
                    data-testid="loginPassword"/>
                <br />
                <button
                    type="button"
                    data-testid="submitButton"
                    @click="submitForm">SUBMIT</button>
            </form>
            <span
                v-if="responseMessage"
                data-testid="responseMessage">{{ responseMessage }}</span>
        </div>
    </div>
</template>

<script>
import { userLogin } from '../services/axios/index.js';
import { mapGetters } from 'vuex';

export default {
    name: 'LoginForm',
    data() {
        return {
            mainHeader: 'Vue Unit Test Demo',
            formHeader: 'Login Form',
            welcomeMessage: 'Welcome user!',
            emailData: '',
            passwordData: '',
            responseMessage: '',
        };
    },
    methods: {
        /**
         * This function check the user input for email field against a valid email regex
         * It will return true for valid & false for invalid
         * 
         */
        validateEmail() {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailData)) {
                return true;
            } else {
                this.showAutoHideMessage('Please enter a valid email address');
                return false;
            }
        },
        /**
         * This function check the user input for password field against a valid length
         * It will return true if password length is more than 3 character else it will return false
         */
        validatePassword() {
            if (this.passwordData.length > 3) {
                return true;
            } else {
                this.showAutoHideMessage('Password length should be more than 3 character');
                return false;
            }
        },
        /**
         * This function check user input values and slow login success for failure message
         */
        submitForm() {
            if (this.validateEmail() && this.validatePassword()) {
                const credentialsData = { email: this.email, password: this.password };
                userLogin(credentialsData)
                    .then(response => {
                        if (response.status !== 200) {
                            throw new Error(response.data);
                        }
                        this.showAutoHideMessage(response.data.message);
                    })
                    .catch(error => {
                        // handel error here
                        this.showAutoHideMessage(error.message);
                    });
            }
        },
        /**
         * This function take a string as input
         * It will show the param string for 3 second and then hide it
         */
        showAutoHideMessage(message) {
            this.responseMessage = message;
            setTimeout(() => {
                this.responseMessage = '';
            }, 3000);
        },
    },
    computed: {
        ...mapGetters({ is_login: 'Auth/is_login'}),
    },
};
</script>
