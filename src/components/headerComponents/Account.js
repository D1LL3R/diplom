import React from 'react'
import Swoosh from 'C:/diplom/src/img/swoosh.svg'
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';


export default function Account() {
    const { user, setUser } = useContext(UserContext);
    const [emailError, setEmailError] = useState('Email')
    const [labelClassName, setlLabelClassName] = useState('label')

    let navigate = useNavigate();
    function routeChange() {
        let path = '/';
        navigate(path);
    }
    function ChangeAccountInfo(form, users) {
        let xhr = new XMLHttpRequest();
        let response = {}
        let formData = new FormData(form);
        formData.set('user', users)
        xhr.open('POST', 'http://82.146.63.178/changeAccountInfo');
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                response = JSON.parse(xhr.response)
                console.log(response);
                setUser({
                    ...user,
                    lastName:response.last_name,
                    name:response.name,
                    middleName:response.middle_name,
                    mobileNumber:response.mobile_number
                })
                document.forms.info.name.value = ''
                document.forms.info.last_name.value = ''
                document.forms.info.middle_name.value = ''
                document.forms.info.mobile_number.value = ''
            }
        }
        xhr.send(formData);
    }
    function ChangeLogin(form, users) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(form.login.value).toLowerCase())) {
            setEmailError('Некорректный емейл')
            form.login.className += 'inputerror'
            setlLabelClassName('label error')
        } else {
            setEmailError('Email')
            form.login.className = 'inputlogin'
            setEmailError('')
            let xhr = new XMLHttpRequest();
            let response = {}
            let formData = new FormData(form);
            formData.set('user', users)
            xhr.open('POST', 'http://82.146.63.178/changeLogin');
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    response = JSON.parse(xhr.response)
                    setEmailError('Ваши данные обновлены')
                    setlLabelClassName('label success')
                    console.log(response);
                    setUser({
                        ...user,
                        login: form.login.value
                    })
                }
                else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 403) {
                    setEmailError('Ошибка при записи')
                    console.log(JSON.parse(xhr.response));
                    form.login.className += ' inputerror'
                }
            }
            xhr.send(formData);
        }
    }
    return (
        <div className='account'>
            <div className='account_info'>
                <h1>Данные о профиле</h1>
                <form name='info'>
                    <li>
                        <div className='info'>
                            <span className='desc'>
                                Фамилия
                            </span>
                            <input name = 'last_name'className='value' placeholder={user.lastName ? user.lastName : "Данных нет"}>

                            </input>
                        </div>
                        <img src={Swoosh} />
                    </li>
                    <li>
                        <div className='info'>
                            <span className='desc'>
                                Имя
                            </span>
                            <input  name = 'name' className='value' placeholder={user.name ? user.name : "Данных нет"}>

                            </input>
                        </div>
                        <img src={Swoosh} />
                    </li>
                    <li>
                        <div className='info'>
                            <span className='desc'>
                                Отчество (если имеется)
                            </span>
                            <input  name = 'middle_name' className='value' placeholder={user.middleName ? user.middleName : "Данных нет"}>

                            </input>
                        </div>
                        <img src={Swoosh} />
                    </li>
                    <li>
                        <div className='info'>
                            <span className='desc'>
                                Номер телефона
                            </span>
                            <InputMask mask='+7(999) 999-99-99' placeholder={user.mobileNumber ? user.mobileNumber:'000000'} className='value' name='mobile_number'>
                            </InputMask>
                        </div>
                        <img src={Swoosh} />
                    </li>
                </form>
                <button onClick={() => ChangeAccountInfo(document.forms.info, user.login)}>
                        Применить
                    </button>
            </div>
            <div className='change_account_info'>
                <h2>
                    Данные для входа
                </h2>
                <form name='username'>
                    <label for='name' className={labelClassName}> {emailError}</label>
                    <input type='text' name='login' placeholder={user.login} className='inputlogin'></input>
                    <label for='password'> Пароль</label>
                    <input type='password' name='password' placeholder='**********'></input>
                </form>
                <button onClick={() => ChangeLogin(document.forms.username, user.login)}>
                    Применить
                </button>
            </div>

        </div>
    )
}
