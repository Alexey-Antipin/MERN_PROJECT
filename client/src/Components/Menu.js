import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from "../Context/AuthContext";

export const Menu = () => {
  const { userId } = useContext(AuthContext)

  //Хранилище для контактов
  const [NamesContact, SetNamesContact] = useState([])

  //Value
  const [valueName, SetValueName] = useState('')
  const [valueTelefon, SetValueTelefon] = useState('')

  //Контейнер перед отправкой
  const ContainerSend = {
    firstname: valueName,
    telefon: valueTelefon,
    status: false
  }

  //Post.Добавление контакта.
  const AddContact = async (req, res) => {
    try {
      await axios.post('/api/auth/addcontact', { ...ContainerSend, userId }, {
        headers: { "Content-Type": "application/json" }
      })
        .then(() => {
          GetContact()
          SetValueName('')
          SetValueTelefon('')
        })
    } catch (error) {
      console.log("Контакт не отправлен", error)
    }
  }

  //Get.Получение контакта.
  const GetContact = async (req, res) => {
    try {
      await axios.get('/api/auth/getcontacts', {
        headers: {
          "Content-Type": "application/json"
        },
        params: { userId }
      })
        .then((res) => SetNamesContact(res.data))

    } catch (error) {
      console.log("Контакт не получен", error)
    }
  }

  //Get
  useEffect(() => {
    GetContact()
  }, [])

  //Put.Статус
  const RedactionContact = async (id) => {
    try {
      await axios.put(`/api/auth/redactionStatusContact/${id}`, { id }, {
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => {
          SetNamesContact([...NamesContact], res.data)
          GetContact()
        })
    } catch (error) {
      console.log("Контакт не поменял статус", error)
    }
  }

  //Delete.Удаление контакта.
  const RemoveContact = async (id) => {
    try {
      await axios.delete(`/api/auth/removecontact/${id}`, { id }, {
        headers: { "Content-Type": "application/json" }
      })
        .then(() => GetContact())
    } catch (error) {
      console.log("Контакт не удален", error)
    }
  }

  // Value.filter
  const [Poiskovik, setPoiskovik] = useState('')

  //Фильтр
  const poisk = NamesContact.filter((names) => {
    return names.firstname.toLowerCase().includes(Poiskovik.toLowerCase())

  })

  //Редактирование.
  const [redaction, setRedaction] = useState('')
  const [Numredaction, setNumRedaction] = useState('')
  const sendRedaction = {
    firstname: redaction,
    telefon: Numredaction
  }

  //Редактирование контакта.
  const RedactionName = async (id) => {
    try {
      await axios.put(`/api/auth/saveRedactionContact/${id}`, { id }, { ...sendRedaction }, {
        headers: { "Content-Type": "application/json" }
      })
        .then(GetContact(),
          setRedaction(''),
          setNumRedaction('')
        )
    } catch (error) {
      console.log("Контакт не отредактирован", error)
    }
  }

  return (
    <div className="Menu">

      {/* Форма добавления контактов */}
      <form onClick={(e) => e.preventDefault()}>
        <div className="Menu__Inputs">
          <input
            className="Menu__Input"
            placeholder="Имя"
            value={valueName}
            onChange={(e) => SetValueName(e.target.value)}>
          </input>

          <input
            className="Menu__Input"
            placeholder="Телефон"
            value={valueTelefon}
            onChange={(e) => SetValueTelefon(e.target.value)}>
          </input>

          <button
            className="Menu__Button"
            onClick={() => AddContact()}>
            Добавить
          </button>
        </div>
      </form>

      {/* Поисковик */}
      <div className="Menu__Poisk">
        <div>Поисковик:</div>
        <input className="Menu__Poiskovik" onChange={(event) => setPoiskovik(event.target.value)} placeholder="Вводите"></input>
      </div>

      {/* Форма показывание контактов */}
      <div className="Menu__Contacts">
        {
          poisk.map((e) =>
          (<div className="Menu__container" key={e._id}>
            <div className="Menu__Contact">Имя:_<div className="Menu-blue">{e.firstname}</div></div>
            <div className="Menu__Contact">Номер телефона:_<div className="Menu-blue">{e.telefon}</div></div>
            <div className="Menu__Button" onClick={() => RemoveContact(e._id)}>Удалить</div>
            <div className="Menu__Button" onClick={() => RedactionContact(e._id)}>Редактировать</div>

            <div>{e.status == true ?
              <div className="Menu__Redaction">
                <input
                  className="Menu__Input "
                  placeholder="Имя"
                  value={redaction}
                  onChange={(e) => { setRedaction(e.target.value) }} />

                <input
                  className="Menu__Input"
                  placeholder="Номер телефона"
                  value={Numredaction}
                  onChange={(e) => { setNumRedaction(e.target.value) }} />

                <button
                  onClick={() => RedactionName(e._id)}
                  className="Menu__Button">
                  Сохранить
                </button>

              </div> : <div></div>}
            </div>
          </div>))
        }
      </div>
    </div >
  )
}
