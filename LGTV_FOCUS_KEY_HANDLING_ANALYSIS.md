# LGTV Reference App - Focus and Key Handling Analysis

## Overview

The LGTV reference app uses a **centralized routing pattern** for key handling with **manual focus management** using jQuery. There is NO complex spatial navigation library - instead, it uses simple index-based focus tracking.

---

## Core Architecture

### 1. Global Key Event Listener (main.js)

```javascript
document.addEventListener('keydown', function(e) {
    // Platform-specific handling (Samsung EXIT key, keyboard state)
    if(platform==='samsung'){
        if(e.keyCode==tvKey.EXIT){
            tizen.application.getCurrentApplication().exit();
        }
    }
    
    // CENTRAL ROUTING: Route key events to current page's HandleKey function
    switch (current_route) {
        case "login":
            login_page.HandleKey(e);
            break;
        case "home-page":
            home_page.HandleKey(e);
            break;
        case "channel-page":
            channel_page.HandleKey(e);
            break;
        // ... more pages
    }
});
```

**Key Pattern:**
- **ONE** global `keydown` listener attached to `document`
- Routes ALL key events based on `current_route` variable
- Each page has its own `HandleKey(e)` function
- No individual `onKeyDown` handlers on DOM elements
- No `data-tv-focusable` attributes

---

## 2. Platform-Specific Key Codes (keyTizen.js)

The app initializes platform-specific key mappings in `initKeys()`:

```javascript
function initKeys() {
    if(platform==='samsung'){
        tvKey = {
            ENTER: 13,
            RETURN: 10009,  // Samsung Back button
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            RED: 403,
            GREEN: 404,
            YELLOW: 405,
            BLUE: 406,
            EXIT: 10182,
            // ... more keys
        };
    }else if(platform==='lg'){
        tvKey = {
            ENTER: 13,
            RETURN: 461,    // LG Back button (DIFFERENT!)
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            RED: 403,
            GREEN: 404,
            YELLOW: 405,
            BLUE: 406,
            // ... more keys
        };
    }
    window.tvKey = tvKey;  // Make globally available
}
```

**Critical Differences:**
- Samsung RETURN: `10009`
- LG RETURN: `461`
- Both platforms share same codes for arrows, ENTER, color buttons

---

## 3. Focus Management Pattern

### Focus State Object

Each page maintains a `keys` object that tracks focus state:

```javascript
var home_page={
    keys:{
        focused_part:"menu_selection",  // Current focused area
        menu_selection:0,               // Index within that area
        submenu_selection:0,
        grid_selection:0,
        slider_selection:0,
        // ... more indices
    },
    // ... rest of page object
}
```

### Focus Tracking Strategy

**Not Using:**
- ❌ Spatial navigation libraries
- ❌ Browser focus API
- ❌ `data-tv-focusable` attributes
- ❌ Complex focus trees

**Using:**
- ✅ Simple index tracking (0, 1, 2, 3...)
- ✅ jQuery `.addClass('active')` for visual focus
- ✅ Manual DOM element selection by index
- ✅ State machine pattern (`focused_part` determines behavior)

### Example Focus Implementation

```javascript
// When hovering/focusing a grid item
hoverMovieGridItem:function(element){
    var keys=this.keys;
    keys.focused_part="grid_selection";
    keys.grid_selection=$(element).data('index');  // Get index from data attribute
    
    // Visual focus update
    $(this.movie_grid_doms).removeClass('active');
    $(element).addClass('active');
    
    // Scroll into view if needed
    moveScrollPosition($('#movie-grids-container'), element, 'vertical');
}
```

---

## 4. Page-Specific HandleKey Function

### Login Page Example (login_operation.js)

```javascript
HandleKey:function(e) {
    switch(e.keyCode){
        case tvKey.DOWN:
            this.handleMenuUpDown(1);
            break;
        case tvKey.UP:
            this.handleMenuUpDown(-1);
            break;
        case tvKey.LEFT:
            this.handleMenuLeftRight(-1);
            break;
        case tvKey.RIGHT:
            this.handleMenuLeftRight(1);
            break;
        case tvKey.ENTER:
            this.handleMenuClick();
            break;
        case tvKey.RETURN:
            // Go back or show exit modal
            if(this.keys.focused_part==="playlist_selection"){
                $('#turn-off-modal').modal('show');
                this.keys.focused_part="turn_off_modal";
            }
            break;
    }
}
```

### Home Page Example (home_operation.js)

```javascript
HandleKey:function(e){
    if(!this.is_drawing) {  // Prevent key handling during rendering
        switch (e.keyCode) {
            case tvKey.RIGHT:
                this.handleMenuLeftRight(1);
                break;
            case tvKey.LEFT:
                this.handleMenuLeftRight(-1);
                break;
            case tvKey.DOWN:
                this.handleMenusUpDown(1)
                break;
            case tvKey.UP:
                this.handleMenusUpDown(-1)
                break;
            case tvKey.ENTER:
                this.handleMenuClick();
                break;
            case tvKey.RED:
                this.removeMovieFromFeaturedList();
                break;
            case tvKey.YELLOW:
                this.addVodOrSeriesToFavourite();
                break;
            case tvKey.BLUE:
                this.moveToOtherCategory();
                break;
            case tvKey.RETURN:
                this.goBack();
        }
    }
}
```

**Pattern:**
- Simple `switch(e.keyCode)` statement
- Delegates to helper functions for each direction
- Uses `tvKey` constants for readability
- Color buttons trigger specific actions (RED/YELLOW/BLUE)

---

## 5. Navigation Helper Functions

### Movement Functions

```javascript
handleMenuUpDown:function(increment){
    var keys=this.keys;
    
    // State machine: Different behavior based on focused_part
    if(keys.focused_part==="network_issue_btn"){
        // Can't move up/down in horizontal menu
        return;
    }
    if(keys.focused_part==="turn_off_modal"){
        // Different handling for modal
        return;
    }
}

handleMenuLeftRight:function(increment){
    var keys=this.keys;
    
    if(keys.focused_part==="network_issue_btn"){
        // Update index
        keys.network_issue_btn+=increment;
        
        // Clamp to valid range
        if(keys.network_issue_btn<0)
            keys.network_issue_btn=0;
        else if(keys.network_issue_btn>=this.network_btn_doms.length)
            keys.network_issue_btn=this.network_btn_doms.length-1;
        
        // Update visual focus
        $(this.network_btn_doms).removeClass('active');
        $(this.network_btn_doms[keys.network_issue_btn]).addClass('active');
    }
}
```

### Click/Select Function

```javascript
handleMenuClick:function(){
    var keys=this.keys;
    
    // State machine: Different behavior based on focused_part
    switch(keys.focused_part) {
        case "network_issue_btn":
            // Trigger click on the focused button
            $(this.network_btn_doms[keys.network_issue_btn]).trigger('click');
            break;
        case "turn_off_modal":
            // Handle modal button click
            var buttons=$('#turn-off-modal').find('button');
            $(buttons[keys.turn_off_modal]).trigger('click');
            break;
        // ... more cases
    }
}
```

---

## 6. Scroll Management

The app handles scrolling manually when focus moves:

```javascript
function moveScrollPosition(parent_element, element, direction, to_top) {
    if(direction==='vertical'){
        var padding_top=parseInt($(parent_element).css('padding-top').replace('px',''));
        var padding_bottom=parseInt($(parent_element).css('padding-bottom').replace('px',''));
        var parent_height=parseInt($(parent_element).css('height').replace('px',''));
        var child_position=$(element).position();
        var element_height=parseInt($(element).css('height').replace('px',''));
        
        // Scroll down if element is below viewport
        if(child_position.top+element_height>=parent_height-padding_bottom){
            $(parent_element).animate({ 
                scrollTop: '+='+(child_position.top+element_height-parent_height+padding_bottom)
            }, 10);
        }
        
        // Scroll up if element is above viewport
        if(child_position.top-padding_top<0){
            $(parent_element).animate({ 
                scrollTop: '+='+(child_position.top-padding_top)
            }, 2);
        }
    }
}
```

---

## 7. Route Management

```javascript
var current_route='login';  // Global variable

// When navigating to a new page:
function goToHomePage(){
    current_route='home-page';  // Update route
    $('#login-container').hide();
    home_page.init();
    // Keys will now route to home_page.HandleKey()
}
```

---

## Key Takeaways

### What They DO Use:
1. ✅ **Single global keydown listener** on `document`
2. ✅ **Central routing** via `switch(current_route)`
3. ✅ **Page-specific HandleKey functions** 
4. ✅ **Manual focus tracking** with index-based state
5. ✅ **jQuery for DOM manipulation** and visual focus
6. ✅ **State machine pattern** with `focused_part`
7. ✅ **Platform-specific key codes** initialized once
8. ✅ **Manual scroll management**

### What They DON'T Use:
1. ❌ Individual `onKeyDown` handlers on elements
2. ❌ `data-tv-focusable` attributes
3. ❌ Complex spatial navigation libraries
4. ❌ Browser focus API (`document.activeElement`)
5. ❌ React hooks for key handling
6. ❌ Multiple event listeners
7. ❌ Focus trees or hierarchies

### Why This Pattern Works:

**Advantages:**
- ✅ **Simple and predictable** - easy to debug
- ✅ **Full control** - no library magic
- ✅ **Platform-specific handling** easy to implement
- ✅ **State-driven** - clear flow of control
- ✅ **Performance** - no complex focus calculations
- ✅ **Reliable** - works on old Samsung/LG TVs

**Disadvantages:**
- ❌ More boilerplate code per page
- ❌ Manual index management
- ❌ Need to track DOM element arrays

---

## Comparison with Your Current Implementation

### Your Guide Pages (Guide1-4) ✅ CORRECT
```javascript
useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 13 || e.key === 'Enter') {
            setLocation('/guide-2');
        }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
}, [setLocation]);
```
**This matches the LGTV pattern!** Simple, direct, effective.

### Your Main Pages (Discover, Genres, etc.) ⚠️ HYBRID
You're using:
- `useTVNavigation()` hook
- `data-tv-focusable` attributes  
- Spatial navigation library (`tv-spatial-navigation.js`)
- Global color button routing (`tv-remote-keys.js`)

**This is MORE complex than the LGTV reference!**

---

## Recommendations

### Option 1: Keep Current Hybrid Approach ✅
**Pros:**
- Already working
- Spatial navigation handles grid layouts well
- Modern React patterns

**Cons:**
- More complex than reference
- Harder to debug
- Two navigation systems coexist

### Option 2: Simplify to Match LGTV Pattern
**Changes needed:**
- Remove `useTVNavigation()` hook from main pages
- Remove spatial navigation library
- Implement page-specific `HandleKey` functions
- Use index-based focus tracking
- Manual `.addClass('active')` for visual focus

**Pros:**
- Matches proven pattern
- Simpler mental model
- Easier to debug

**Cons:**
- Significant refactoring needed
- Lose automatic spatial navigation

---

## Conclusion

The LGTV reference app uses a **remarkably simple** approach:
1. One global keydown listener
2. Route to page-specific HandleKey functions
3. Manual index tracking
4. jQuery for visual focus
5. State machine for behavior

This is **much simpler** than modern spatial navigation libraries, and it works reliably on Samsung and LG TVs because it doesn't rely on browser focus APIs or complex focus management.
