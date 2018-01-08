"use strict"

var ease = require('./easing.js').ease
var resolution = 25

function Anim() {
	this.fx_stack = []
	this.interval = null;
}

Anim.prototype.add = function(to, duration, options) {
	var options  = options  || {}
	var duration = duration || resolution
	options['easing'] = options['easing'] || 'linear'
	this.fx_stack.push({'to': to, 'duration': duration, 'options': options})
	return this
}

Anim.prototype.delay = function(duration) {
	return this.add({}, duration)
}

Anim.prototype.stop = function () {
	console.log('ANIMATION STOPPED (FORCED)');
	  if(this.interval){
	    clearInterval(this.interval);
	  }
	  this.fx_stack = [];
}

Anim.prototype.run = function(universe, onFinish) {
	console.log('START ANIMATION');
	var config = {}
	var t = 0
	var d = 0
	var a

	var fx_stack = this.fx_stack;
	var ani_setup = function() {		
		a = fx_stack.shift()		
		if (Object.keys(a.to).length != 512) {
			console.log('animation step')
			console.log(a)
		} else {
			console.log('preserve old state')
		}		
		t = 0
		d = a.duration
		config = {}
		for(var k in a.to) {
			config[k] = {
				'start': universe.get(k),
				'end':   a.to[k]
			}
		}
	}
	var ani_step = function() {
		var new_vals = {}
		for(var k in config) {
			new_vals[k] = Math.round(config[k].start + ease['linear'](t, 0, 1, d) * (config[k].end - config[k].start))
		}
		t = t + resolution
		universe.update(new_vals)
		if(t > d) {
			if(fx_stack.length > 0) {
				ani_setup()
			} else {
				console.log('ANIMATION STOPPED');
				clearInterval(iid)
				if(onFinish) onFinish()
			}
		}
	}

	ani_setup()
	var iid = this.interval = setInterval(ani_step, resolution);
}

module.exports = Anim