export const MESSAGE = {
  START: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Hola soy tu amigo PAGO FACIL, ¿Deseas pagar una deuda o enviarle dinero a alguien de manera segura?.',
            subtitle: 'Presione un botón para responder',
            buttons: [
              {
                type: 'postback',
                title: 'Si!',
                payload: 'yes',
              },
              {
                type: 'postback',
                title: 'No!',
                payload: 'no',
              },
            ],
          },
        ],
      },
    },
  },
  NO_START : {
    text: 'Gracias por usar el servicio de PAGO FACIL, escriba "Empezar" si desea realizar un pago.',
  },
  GET_PHONE: {
    text: 'Introduce el número telefónico al cual desea enviar el dinero.',
  },
  GET_AMOUNT: {
    text: 'Introduce el monto que quiere enviar (BOB)',
  },
  GET_CONFIRMATION_PHONE: {
    text: 'Introduce tu número telefónica para confirmar el pago.',
  },
  PAYMENT_SUCCESSFUL: {
    text: 'El pago ha sido confirmado correctamente. ¿Deseas realizar otro pago?',
  },
};
