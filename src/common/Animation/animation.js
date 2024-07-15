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
        transition: {duration: 2}
    },
    closed: {
        opacity: 0,
        transition: {duration: 2}
    }
}

export const slideDU = {
    initial: {
      y: "50%"
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    },
    closed: {
      opacity: 0,
      y: "50%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  }

  export const slideUD = {
    initial: {
      y: "-50%"
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    },
    closed: {
      opacity: 0,
      y: "-50%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  }

  export const slideLR = {
    initial: {
      x: "-50%"
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    },
    closed: {
      opacity: 0,
      x: "-50%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  }

  export const slideRL = {
    initial: {
      x: "50%"
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    },
    closed: {
      opacity: 0,
      x: "50%",
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  }