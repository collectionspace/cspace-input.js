import compose from '../helpers/compose';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import labelable from '../enhancers/labelable';
import nestable from '../enhancers/nestable';
import repeatable from '../enhancers/repeatable';

/**
 * Applies a set of enhancers to make an input usable as a standalone component in a form.
 */
export default compose(repeatable, labelable, committable, changeable, nestable);
