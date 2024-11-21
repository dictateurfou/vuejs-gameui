
var dragActive = false;


function copyComputedStyles(source, target) {
  const computedStyle = window.getComputedStyle(source);
  
  // Liste des propriétés CSS à copier
  const properties = [
      'position', 'top', 'left', 'right', 'bottom',
      'width', 'height', 'margin', 'padding',
      'border', 'boxSizing', 'backgroundColor',
      'fontSize', 'fontFamily', 'fontWeight',
      'color', 'display', 'flex', 'justifyContent',
      'alignItems', 'textAlign', 'zIndex',
      'opacity', 'pointerEvents', 'overflow',
      // Ajoutez d'autres propriétés si nécessaire
  ];

  properties.forEach(prop => {
      target.style[prop] = computedStyle.getPropertyValue(prop);
  });

  // Recursion pour les enfants
  const sourceChildren = source.children;
  const targetChildren = target.children;

  for (let i = 0; i < sourceChildren.length; i++) {
      copyComputedStyles(sourceChildren[i], targetChildren[i]);
  }
}

const onDrag = {
    mounted: function (el, binding, vnode) {
      // Vérification que la valeur passée est une fonction
      if (typeof binding.value !== 'function') {
        const compName = vnode?.ctx?.type?.name || 'unknown';
        console.warn(`[Vue-drag:] provided expression '${binding.expression}' is not a function, but has to be. Found in component '${compName}'`);
        return;
      }
  
      el.__args__ = binding.arg ? binding.value.args : undefined;
  
      const dragMove = function (e) {
        const rect = vnode.el.ownerDocument.body.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.__clone__.style.left = (x - el.offsetWidth / 2) + 'px';
        el.__clone__.style.top = (y - el.offsetHeight / 2) + 'px';
      };
  
      const handlerMove = function (e) {
        //if (e.buttons !== 1) return;
        el.onDrag = true;
        dragActive = true;
        binding.value(e, el, ...(el.__args__ || []));
        el.removeEventListener('mousemove', handlerMove);
        window.addEventListener('mousemove', dragMove);
        el.__clone__ = el.cloneNode(true);
        el.__clone__.classList.add('dragDiv');
        //el.__clone__.style.width = (el.clientWidth - 10) + 'px';
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        //we neeed to copy the computed style of the because if style is scopped he doesnt know css on body
        copyComputedStyles(el, el.__clone__);
        document.body.appendChild(el.__clone__);
        
      };
  
      const handler = function (e) {
        console.log("handler")
        if (e.button !== 0) return;
        console.log("handler2")
        el.addEventListener('mousemove', handlerMove);
        window.addEventListener('mouseup', el.__mouseUp__);
      };
  
      el.__mouseUp__ = function (e) {
        console.log("mouseup")
        if (e.button !== 0) return;
        if (el.onDrag) {
          el.onDrag = false;
          dragActive = false;
          window.removeEventListener('mousemove', el.__dragMove__);
          if (el.__clone__) {
            el.__clone__.remove();
          }
          binding.value(e, el);
        }
        el.removeEventListener('mousemove', el.__handlerMove__);
      };
  
      el.__dragMove__ = dragMove;
      el.__handlerMove__ = handlerMove;
      el.__vueDrag__ = handler;
  
      el.addEventListener('mousedown', handler);
    },
  
    unmounted: function (el) {
      el.removeEventListener('mousedown', el.__vueDrag__);
      window.removeEventListener('mousemove', el.__dragMove__);
      el.__vueDrag__ = null;
      el.__dragMove__ = null;
    }
};

const onDragStop = {
    mounted: function (el, binding, vnode) {
      /*if (!vnode.dirs.some(function (d) { return d.dir.name === 'onDrag'; })) {
        console.warn('You need onDrag directive for using onDragStop');
        return;
      }*/
  
      el.__mouseUp__ = function (e) {
        if (e.button !== 0) return;
        if (el.onDrag) {
          el.onDrag = false;
          dragActive = false;
          window.removeEventListener('mousemove', el.__dragMove__);
          if (el.__clone__) {
            el.__clone__.remove();
          }
          if (typeof binding.value === 'function') {
            binding.value(e, el);
          }
        }
      };
  
      window.addEventListener('mouseup', el.__mouseUp__);
    },
  
    unmounted: function (el) {
      window.removeEventListener('mouseup', el.__mouseUp__);
    }
};

const onDragDrop = {
    mounted: function (el, binding, vNode) {
      const mouseUpDrop = function (e) {
        if (e.button !== 0 || !dragActive) return;
  
        if (typeof binding.value === 'function') {
          // Accéder aux attributs via vnode.props au lieu de vnode.data.attrs
          const dropArgs = vNode.props['drop-args'];
          if (dropArgs !== undefined) {
              binding.value(e, el, ...dropArgs);
          } else {
              binding.value(e, el);
          }
      } else if (binding.value.cb) {
          if (binding.value.args === undefined) {
              binding.value.cb(e, el);
          } else {
              binding.value.cb(e, el, ...binding.value.args);
          }
      }
  
        dragActive = false;
      };
  
      el.addEventListener('mouseup', mouseUpDrop);
      el.__mouseUpDrop__ = mouseUpDrop;
    },
  
    unmounted: function (el) {
      el.removeEventListener('mouseup', el.__mouseUpDrop__);
      el.__mouseUpDrop__ = null;
    }
  };

export { onDrag, onDragStop, onDragDrop };