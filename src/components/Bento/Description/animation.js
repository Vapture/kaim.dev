export const slideUp = {
    initial: {
        y: "100%"
    },
    open: (i) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.01 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}

export const slideUpSticker = {
    initial: {
        y: "100%"
    },
    open: {
        y: "0%",
        transition: {duration: 1}
    },
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}

export const slideUpBento = {
    initial: {
        y: "100%"
    },
    open: (i) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.06 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}

export const opacity = {
    initial: {
        opacity: 0
    },
    open: {
        opacity: 1,
        transition: {duration: 0.5}
    },
    closed: {
        opacity: 0,
        transition: {duration: 0.5}
    }
}

export const slideUpMinimal = {
    initial: {
        y: "50%"
    },
    open: {
        opacity: 1,
        y: "0%",
        transition: {duration: 1}
    },
    closed: {
        opacity: 0,
        y: "1%",
        transition: {duration: 0.2}
    }
}