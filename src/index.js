const vueTabEvents = {
  install: function (Vue) {
    Vue.config.globalProperties.$IsJsonString = function IsJsonString (str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }

    Vue.config.globalProperties.$tabEvent = {
      emit: function emit (event, data) {
        if (!data) {
          localStorage.setItem('event', event)
        }
        if (data) {
          if (typeof data !== 'string') localStorage.setItem('eventWithData', `${event}!@#$%${JSON.stringify(data)}`)
          else localStorage.setItem('eventWithData', `${event}!@#$%${data}`)
        }
        localStorage.removeItem('event')
        localStorage.removeItem('eventWithData')
      },

      on: function on (event, callback) {
        function listner (e) {
          if (e.newValue == null) return
          else if (e.key == 'event') {
            if (e.newValue === event) return callback()
          } else if (e.key == 'eventWithData') {
            const ev = e.newValue.split('!@#$%')
            if (ev[0] === event) {
              if (Vue.config.globalProperties.$IsJsonString(ev[1])) return callback(JSON.parse(ev[1]))
              else return callback(ev[1])
            }
          }
        }

        window.addEventListener('storage', listner)

        window.addEventListener('offanEvent', r => {
          if (r.detail.eventToOff === event) window.removeEventListener('storage', listner)
        })
      },

      off: function off (event) {
        const ev = new CustomEvent('offanEvent', { detail: { eventToOff: event } })
        window.dispatchEvent(ev)
      }
    }
  }
}

export default vueTabEvents

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueTabEvents)
}
