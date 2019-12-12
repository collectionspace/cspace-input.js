import compose from '../helpers/compose';
import changeable from './changeable';
import committable from './committable';
import labelable from './labelable';
import repeatable from './repeatable';

/**
 * Applies a set of enhancers to make an input usable as a standalone component in a form.
 */
export default compose(repeatable, labelable, committable, changeable);
