import BaseController from "../controllers/base.controller";
import { Router } from "express";

const serviceMethods = {};
const interceptorMethods = {};

export const ServiceController = (config: any) => {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        let self: any;
        const Controller = class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                self = this;
            }
        };
        const proto = constructor.prototype;
        Object.getOwnPropertyNames(proto).forEach(key => {
            if (key === 'constructor') {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            if (descriptor && typeof descriptor.value === 'function') {
                const original = descriptor.value;
                Controller.prototype[key] = (...a: any[]) => original.apply(self, a);
            }
        });

        let name = constructor.name;
        Controller.prototype._route_path = config.path;
        Controller.prototype._skill_name = config.skill || "";
        // Controller.prototype._restrict = config.restricted ? true : false;
        Controller.prototype._router = Router();
        if (serviceMethods[name]) {
            serviceMethods[name].forEach(element => {
                Controller.prototype._router[element.method](element.path, Controller.prototype[element.name]);
            });
        }

        if (interceptorMethods[name]) {
            Controller.prototype._interceptor = interceptorMethods[name];
        }

        return Controller;
    }
}

export function ServiceMethod(config: any) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor.value.length < 2) {
            throw new Error("Service method should have atleast two arguments. e.g. (req, res).");
        }
        config = config || {};
        config.path = config.path || "/";
        config.method = config.method || "get";

        let obj = serviceMethods[target.constructor.name] || [];

        obj.push({
            name: propertyKey,
            method: config.method.toLowerCase(),
            path: config.path,
            service: descriptor.value
        })
        serviceMethods[target.constructor.name] = obj;
    }
}

export function ServiceInterceptor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    interceptorMethods[target.constructor.name] = propertyKey;
}

