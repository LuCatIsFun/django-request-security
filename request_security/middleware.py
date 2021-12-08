"""
@author: liyao
@contact: liyao2598330@126.com
@time: 2020/7/30 4:42 下午
"""
from django.utils.deprecation import MiddlewareMixin
from django.utils.module_loading import import_string

from request_security.signature import check_signature, log
from request_security.settings import SIGNATURE_RESPONSE, ENABLE_REQUEST_SIGNATURE


class RequestSignMiddleware(MiddlewareMixin):

    @staticmethod
    def process_view(request, view_func, view_args, view_kwargs):
        if ENABLE_REQUEST_SIGNATURE:
            # check view settings
            ignore_sign_method = getattr(view_func.cls, 'ignore_sign_method', [])
            if not isinstance(ignore_sign_method, list):
                log.warning(
                    'function: %s parameter: ignore_sign_method will not take effect, type must list, not %s' % (
                        view_func.__name__, type(ignore_sign_method)
                    )
                )
                ignore_sign_method = []
            if ignore_sign_method and \
                request.method.lower() in ignore_sign_method:
                return None
            # check sign
            if not check_signature(request):
                return import_string(SIGNATURE_RESPONSE)()
