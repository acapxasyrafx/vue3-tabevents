// vueTabEvents.js
const vueTabEvents = {
  install(app) {
    // Add $IsJsonString to global properties
    app.config.globalProperties.$IsJsonString = function IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };

    // Add $tabEvent to global properties
    app.config.globalProperties.$tabEvent = {
      emit(event, data) {
        if (!data) {
          localStorage.setItem('event', event);
        }
        if (data) {
          if (typeof data !== 'string') {
            localStorage.setItem('eventWithData', `${event}!@#$%${JSON.stringify(data)}`);
          } else {
            localStorage.setItem('eventWithData', `${event}!@#$%${data}`);
          }
        }
        localStorage.removeItem('event');
        localStorage.removeItem('eventWithData');
      },

      on(event, callback) {
        function listener(e) {
          if (e.newValue == null) return;
          if (e.key === 'event') {
            if (e.newValue === event) return callback();
          } else if (e.key === 'eventWithData') {
            const ev = e.newValue.split('!@#$%');
            if (ev[0] === event) {
              if (app.config.globalProperties.$IsJsonString(ev[1])) {
                return callback(JSON.parse(ev[1]));
              } else {
                return callback(ev[1]);
              }
            }
          }
        }

        window.addEventListener('storage', listener);

        window.addEventListener('offanEvent', (r) => {
          if (r.detail.eventToOff === event) {
            window.removeEventListener('storage', listener);
          }
        });
      },

      off(event) {
        const ev = new CustomEvent('offanEvent', { detail: { eventToOff: event } });
        window.dispatchEvent(ev);
      }
    };
  }
};

export default vueTabEvents;

// Automatically install the plugin if Vue is available globally
if (typeof window !== 'undefined' && window.Vue) {
  const app = window.Vue.createApp({});
  app.use(vueTabEvents);
}
