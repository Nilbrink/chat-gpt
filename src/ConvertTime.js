import moment from "moment/moment"

export const ConvertTime = (unix_timestamp) => {
    
    var timestamp = moment.unix(unix_timestamp);
    var formattedTime = timestamp.format('MMMM Do YYYY, h:mm:ss')
    
    return formattedTime

}