function extendedThrottle(startCb, tickCb, endCb, tickRate, waitThreshold, context) {
  if (!tickRate) tickRate = 250;
  if (!waitThreshold) waitThreshold = tickRate;

  var first = true,
    last,
    deferTimer;

  return function() {
    var ctx = context || this,
      now = (Date.now && Date.now()) || new Date().getTime(),
      args = arguments;

    if (!(last && now < last + tickRate)) {
      last = now;
      if (first) {
        startCb.apply(ctx, args);
        first = false;
      } else {
        tickCb.apply(ctx, args);
      }
    }

    clearTimeout(deferTimer);
    deferTimer = setTimeout(function() {
      last = now;
      first = true;
      endCb.apply(ctx, args);
    }, waitThreshold);
  };
};

module.exports = extendedThrottle