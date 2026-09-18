// OpenTelemetry Node.js Distributed Tracing Instrumentation Example
const opentelemetry = require('@opentelemetry/api');

// Acquire a tracer from the global OpenTelemetry API
const tracer = opentelemetry.trace.getTracer('checkout-service', '1.0.0');

async function processUserCheckout(userId, cartId) {
  // 1. Create a Root Span representing the entire checkout operation
  return tracer.startActiveSpan('processUserCheckout', async (rootSpan) => {
    try {
      rootSpan.setAttribute('user.id', userId);
      rootSpan.setAttribute('cart.id', cartId);

      // 2. Child Span: Validate User Authentication
      const user = await tracer.startActiveSpan('validateUserAuth', async (childSpan) => {
        childSpan.addEvent('Calling Auth Microservice via gRPC');
        // Simulated network call
        await new Promise((r) => setTimeout(r, 45));
        childSpan.end();
        return { authenticated: true };
      });

      // 3. Child Span: Charge Credit Card via Stripe
      const payment = await tracer.startActiveSpan('chargeCreditCard', async (paymentSpan) => {
        paymentSpan.setAttribute('payment.gateway', 'stripe');
        paymentSpan.setAttribute('amount.usd', 99.50);

        // Simulated external HTTP request
        await new Promise((r) => setTimeout(r, 220));
        paymentSpan.end();
        return { success: true, txnId: 'ch_3N8e...' };
      });

      rootSpan.setStatus({ code: opentelemetry.SpanStatusCode.OK });
      return { status: 'Checkout Complete', txnId: payment.txnId };

    } catch (err) {
      // Record exception in the trace for instant root-cause analysis!
      rootSpan.recordException(err);
      rootSpan.setStatus({
        code: opentelemetry.SpanStatusCode.ERROR,
        message: err.message
      });
      throw err;
    } finally {
      // Always end spans to flush timing data to OTel collector
      rootSpan.end();
    }
  });
}

module.exports = { processUserCheckout };
