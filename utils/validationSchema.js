import joi from 'joi'

const signUpBodyValidation = (body) => {
    const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    })
    return schema.validate(body)
}

const loginBodyValidation = (body) => {
    const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })
    return schema.validate(body)
}




export  {
    signUpBodyValidation,
    loginBodyValidation,
    
}