
export const isIOS = window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
export const isAndroid = window.navigator.userAgent.match(/Android/i);
export const isMobileDevice = isIOS || isAndroid || window.navigator.userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i);
export const isMac = navigator.appVersion.indexOf('Mac') > -1;

export const getInitials = (name) => {
    if (!name) {
        return '';
    }
    name = name.split(' ');
    return name[0].charAt(0) + name[name.length - 1].charAt(0).toUpperCase();
}


export const dateFormat = (date) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date);
    const randomNumber = Math.floor(Math.random()*90) + 100;;
    return `${randomNumber}_${day}-${month}-${year}`;
}

export const removeSpecialSymbolSpace = (inputString: string) => {
    return inputString.replace(/[^A-Z0-9]/ig, "");
}

