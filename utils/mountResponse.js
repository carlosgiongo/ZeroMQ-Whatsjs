function mountResponse(data, message){
    return {
        type: 'response',
        from: data.from,
        content: data.content,
        response: message
    }
}

module.exports = mountResponse;