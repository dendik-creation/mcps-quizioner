<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleAnswering
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         if (session('answers') === true) {
            if (!$request->is('questionnaire/in-progress')) {
                return redirect('/questionnaire/in-progress');
            }
        }

        return $next($request);
    }
}
