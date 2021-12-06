import { mount } from '@vue/test-utils';
import LoginForm from './LoginForm.vue';

// import axios & axios mock
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import flushPromises from 'flush-promises';
import sinon from 'sinon';
import store from '@/store';

/**
 * Create a local Vue instance that needs to be provided to the wrapper
 * And add all plugins that are needed for this component
 */

describe('LoginForm.vue', () => {

    let sandbox;
    let mock;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        //Rest axios mock adopter
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        sandbox.restore();
    });

    // Test#1: Should Instantiate Component
    it('Should instantiate component', async () => {
        // Mount component in isolated wrapper
        const wrapper = mount(LoginForm, {
            store
        });
        await flushPromises();
        expect(wrapper.vm).toBeTruthy();
    });

    // Test#2: Should verify all input fields & submit button are present
    it('Should verify input fields & buttons are visible', async () => {
        const wrapper = mount(LoginForm, {
            store
        });
        await flushPromises();
        const emailInputField = wrapper.find('[data-testid="loginEmail"]');
        const passwordInputField = wrapper.find('[data-testid="loginPassword"]');
        const submitButton = wrapper.find('[data-testid="submitButton"]');
        const responseMessage = wrapper.find('[data-testid="responseMessage"]');
        await flushPromises();
        expect(emailInputField.exists()).toBe(true);
        expect(passwordInputField.exists()).toBe(true);
        expect(submitButton.exists()).toBe(true);
        expect(responseMessage.exists()).toBe(false);
    });

    // Test#3: Should verify email validation
    it('Should verify email validation', async() => {
        const wrapper = mount(LoginForm, {
            store
        });
        const loginEmail = wrapper.find('[data-testid="loginEmail"]');
        loginEmail.setValue('invalid_email');
        wrapper.find('button').trigger('click');
        await flushPromises();
        const responseMessage = wrapper.find('[data-testid="responseMessage"]').text();               
        expect(responseMessage).toBe('Please enter a valid email address');
    });

    // Test#4: Should verify password validation
    it('Should verify password validation', async () => {
        const wrapper = mount(LoginForm, {
            store
        });
        const loginEmail = wrapper.find('[data-testid="loginEmail"]');
        loginEmail.setValue('abc@gmail.com');
        const loginPassword = wrapper.find('[data-testid="loginPassword"]');
        loginPassword.setValue('1');
        wrapper.find('[data-testid="submitButton"]').trigger('click');
        await flushPromises();
        const responseMessage = wrapper.find('[data-testid="responseMessage"]').text();               
        expect(responseMessage).toBe('Password length should be more than 3 character');
    });

    // Test#5: Should mock failed login message
    it('Should mock failed login message', async () => {
        mock
            .onPost('/login')
            .reply(200, { status: 'error', message: 'wrong username or password', data: {} });
        const wrapper = mount(LoginForm, {
            store
        });
        const loginEmail = wrapper.find('[data-testid="loginEmail"]');
        loginEmail.setValue('abc@gmail.com');
        const loginPassword = wrapper.find('[data-testid="loginPassword"]');
        loginPassword.setValue('12345');
        wrapper.find('[data-testid="submitButton"]').trigger('click');
        await flushPromises();
        const responseMessage = wrapper.find('[data-testid="responseMessage"]').text(); 
        expect(responseMessage).toBe('wrong username or password');
    });

    // Test#6: Should mock successful login message
    it('Should mock successful login message', async () => {
        mock
            .onPost('/login')
            .reply(200, { status: 'success', message: 'login success', data: { 'jwt': 'a_valid_jwt_token' } });

        const wrapper = mount(LoginForm, {
            store
        });

        const loginEmail = wrapper.find('[data-testid="loginEmail"]');
        loginEmail.setValue('abc@gmail.com');
        const loginPassword = wrapper.find('[data-testid="loginPassword"]');
        loginPassword.setValue('12345');
        wrapper.find('[data-testid="submitButton"]').trigger('click');
        await flushPromises();
        const responseMessage = wrapper.find('[data-testid="responseMessage"]').text(); 
        expect(responseMessage).toBe('login success');
    });

    // Test#7: Should stub getters to check already login user message
    it('Should check if user is already logged in', async () => {

        //Stub vuex getters
        const stubGetter = sandbox.stub(store, 'getters');
        stubGetter.value({
            'Auth/is_login': true,
        });

        const wrapper = mount(LoginForm, {
            store
        });

        await flushPromises();
        const welcomeMessage = wrapper.find('[data-testid="welcomeMessage"]').text();
        expect(welcomeMessage).toBe('Welcome user!');
    });

});
