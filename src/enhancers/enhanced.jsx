import compose from '../helpers/compose';
import committable from '../enhancers/committable';
import named from '../enhancers/named';
import uncontrolled from '../enhancers/uncontrolled';

/**
 * Applies a common set of enhancers used by all cspace-input components.
 */
export default compose(committable, uncontrolled, named);
