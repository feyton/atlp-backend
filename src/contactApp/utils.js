export const sendReply = async (ticket, sender, reply) => {
  const template = `
    
    Dear ${sender.name},
    Our Admins have replied to your query with the following:\n
    #### ----------------------

    ${reply}

    ### -------------------------
    Your message has been closed. If you wish to reopen:

    Use the link attached here to reopen your issue.
    And make sure you add a good message to explain your request.


    ### -------------
    ${ticket}

    ### -------------

    or use open this link in the browser:
    http://127.0.0.1:3500/api/v1/contacts/status/${ticket}?open=true

    Note: keep this ticket private. Anyone with the ticket can view the status and replies of your query.

    Thank you from Fabrice H.
    `;

  console.log(template);
};

export const sendTicket = async (ticket, sender) => {
  const template = `
    Dear ${sender.name},
    Thank you for contacting us. Your message was logged:

    Please use the following ticket to follow up:

    ### -------------
    ${ticket}

    ### -------------

    or use open this link in the browser:
    http://127.0.0.1:3500/api/v1/contacts/status/${ticket}

    Note: keep this ticket private. Anyone with the ticket can view the status and replies of your query.

    Thank you from Fabrice H.
    `;
  console.log(template);
};
