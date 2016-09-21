import compose from '../helpers/compose';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';

/**
 * Applies a common set of enhancers used by all cspace-input components.
 */
export default compose(repeatable, labelable, committable, changeable);
