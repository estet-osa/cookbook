<?php

namespace AppBundle\Admin;


use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class IngredientsAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {

        $formMapper
            ->tab('admin.news.general')
                ->with('admin.news.full_title', ['class' => 'col-md-7'])
                    ->add('title', 'text', [
                        'label' => 'admin.news.short_title'
                    ])
                ->end()
            ->end()
        ;

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {

        $datagridMapper
            ->add('title')
        ;

    }

    protected function configureListFields(ListMapper $listMapper)
    {

        $listMapper
            ->addIdentifier('title', 'text', [
                'label' => 'admin.news.id',
            ])
        ;

    }
}
